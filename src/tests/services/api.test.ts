import { beforeEach, describe, expect, it, vi } from 'vitest';

type ApiMockState = {
    api: ReturnType<typeof vi.fn> & {
        defaults: { headers: { common: Record<string, string> } };
        interceptors: {
            request: { use: ReturnType<typeof vi.fn> };
            response: { use: ReturnType<typeof vi.fn> };
        };
    };
    create: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    requestHandler?: (config: any) => any;
    responseFulfilled?: (response: any) => any;
    responseRejected?: (error: any) => Promise<any>;
};

const loadApi = async () => {
    vi.resetModules();

    const state = {} as ApiMockState;
    state.api = vi.fn((config) => Promise.resolve({ data: 'retried', config })) as ApiMockState['api'];
    state.api.defaults = { headers: { common: {} } };
    state.api.interceptors = {
        request: {
            use: vi.fn((fulfilled) => {
                state.requestHandler = fulfilled;
            }),
        },
        response: {
            use: vi.fn((fulfilled, rejected) => {
                state.responseFulfilled = fulfilled;
                state.responseRejected = rejected;
            }),
        },
    };
    state.create = vi.fn(() => state.api);
    state.post = vi.fn();

    vi.doMock('axios', () => ({
        default: {
            create: state.create,
            post: state.post,
        },
    }));

    const { default: api } = await import('../../services/api');

    return { api, state };
};

describe('api client', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.doUnmock('axios');
    });

    it('creates an axios client targeting the local api proxy', async () => {
        const { api, state } = await loadApi();

        expect(api).toBe(state.api);
        expect(state.create).toHaveBeenCalledWith({
            baseURL: '/api',
            withCredentials: true,
        });
        expect(state.api.interceptors.request.use).toHaveBeenCalledTimes(1);
        expect(state.api.interceptors.response.use).toHaveBeenCalledTimes(1);
    });

    it('adds the bearer token to non-auth requests only', async () => {
        const { state } = await loadApi();
        localStorage.setItem('accessToken', 'abc123');

        const privateConfig = state.requestHandler?.({ url: '/users/me', headers: {} });
        const authConfig = state.requestHandler?.({ url: '/auth/login', headers: {} });
        const noUrlConfig = state.requestHandler?.({ headers: {} });

        expect(privateConfig.headers.Authorization).toBe('Bearer abc123');
        expect(authConfig.headers.Authorization).toBeUndefined();
        expect(noUrlConfig.headers.Authorization).toBe('Bearer abc123');
    });

    it('leaves request headers untouched when there is no token', async () => {
        const { state } = await loadApi();

        const config = state.requestHandler?.({ url: '/users/me', headers: {} });

        expect(config.headers.Authorization).toBeUndefined();
    });

    it('passes successful responses through unchanged', async () => {
        const { state } = await loadApi();
        const response = { data: { ok: true } };

        expect(state.responseFulfilled?.(response)).toBe(response);
    });

    it('refreshes the access token and retries a protected request after a 401', async () => {
        const { state } = await loadApi();
        state.post.mockResolvedValueOnce({ data: { accessToken: 'fresh-token' } });
        const originalRequest = { url: '/users/me', headers: {} as Record<string, string>, _retry: undefined as boolean | undefined };

        await expect(state.responseRejected?.({
            response: { status: 401 },
            config: originalRequest,
        })).resolves.toEqual({ data: 'retried', config: originalRequest });

        expect(state.post).toHaveBeenCalledWith('/api/auth/refresh', {}, { withCredentials: true });
        expect(localStorage.getItem('accessToken')).toBe('fresh-token');
        expect(state.api.defaults.headers.common.Authorization).toBe('Bearer fresh-token');
        expect(originalRequest.headers.Authorization).toBe('Bearer fresh-token');
        expect(originalRequest).toMatchObject({ _retry: true });
        expect(state.api).toHaveBeenCalledWith(originalRequest);
    });

    it('also accepts refresh responses that return token instead of accessToken', async () => {
        const { state } = await loadApi();
        state.post.mockResolvedValueOnce({ data: { token: 'legacy-token' } });

        await state.responseRejected?.({
            response: { status: 401 },
            config: { url: '/users/me', headers: {} },
        });

        expect(localStorage.getItem('accessToken')).toBe('legacy-token');
    });

    it('queues concurrent protected requests while refresh is in progress', async () => {
        const { state } = await loadApi();
        let resolveRefresh: (value: { data: { accessToken: string } }) => void = vi.fn();
        state.post.mockImplementationOnce(() => new Promise((resolve) => {
            resolveRefresh = resolve;
        }));

        const firstRequest = { url: '/users/me', headers: {} };
        const secondRequest = { url: '/matches', headers: {} as Record<string, string> };
        const firstResult = state.responseRejected?.({
            response: { status: 401 },
            config: firstRequest,
        });
        const secondResult = state.responseRejected?.({
            response: { status: 401 },
            config: secondRequest,
        });

        resolveRefresh({ data: { accessToken: 'queued-token' } });

        await expect(firstResult).resolves.toEqual({ data: 'retried', config: firstRequest });
        await expect(secondResult).resolves.toEqual({ data: 'retried', config: secondRequest });
        expect(secondRequest.headers.Authorization).toBe('Bearer queued-token');
        expect(state.api).toHaveBeenCalledWith(firstRequest);
        expect(state.api).toHaveBeenCalledWith(secondRequest);
    });

    it('rejects queued requests and clears session when refresh fails', async () => {
        const { state } = await loadApi();
        const refreshError = new Error('refresh failed');
        localStorage.setItem('accessToken', 'stale');
        localStorage.setItem('user', '{"id":1}');
        state.api.defaults.headers.common.Authorization = 'Bearer stale';
        state.post.mockRejectedValueOnce(refreshError);

        await expect(state.responseRejected?.({
            response: { status: 401 },
            config: { url: '/users/me', headers: {} },
        })).rejects.toBe(refreshError);

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(state.api.defaults.headers.common.Authorization).toBeUndefined();
    });

    it('rejects auth endpoint, retried, and non-401 errors without refreshing', async () => {
        const { state } = await loadApi();
        const authError = { response: { status: 401 }, config: { url: '/auth/logout' } };
        const retriedError = { response: { status: 401 }, config: { url: '/users/me', _retry: true } };
        const serverError = { response: { status: 500 }, config: { url: '/users/me' } };

        await expect(state.responseRejected?.(authError)).rejects.toBe(authError);
        await expect(state.responseRejected?.(retriedError)).rejects.toBe(retriedError);
        await expect(state.responseRejected?.(serverError)).rejects.toBe(serverError);
        expect(state.post).not.toHaveBeenCalled();
    });

    it('rejects when refresh succeeds without a token', async () => {
        const { state } = await loadApi();
        const originalError = { response: { status: 401 }, config: { url: '/users/me', headers: {} } };
        state.post.mockResolvedValueOnce({ data: {} });

        await expect(state.responseRejected?.(originalError)).rejects.toBe(originalError);
    });
});
