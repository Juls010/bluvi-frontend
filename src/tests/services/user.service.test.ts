import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../services/api';
import {
    blockUser,
    deleteMyAccount,
    getAccessibilityPreferences,
    getExploreUsers,
    getMyProfile,
    getPrivacy,
    markDiscoverySeen,
    markFaceVerification,
    reportUser,
    updateAccessibilityPreferences,
    updateMyProfile,
    updatePrivacy,
} from '../../services/user.service';

vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('user service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('reads and updates the current profile', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({ data: { user: { id_user: 7, first_name: 'Ada' } } });
        vi.mocked(api.put).mockResolvedValueOnce({ data: { user: { id_user: 7, first_name: 'Grace' } } });

        await expect(getMyProfile()).resolves.toEqual({ id_user: 7, first_name: 'Ada' });
        await expect(updateMyProfile({ first_name: 'Grace' })).resolves.toEqual({ id_user: 7, first_name: 'Grace' });

        expect(api.get).toHaveBeenCalledWith('/users/profile');
        expect(api.put).toHaveBeenCalledWith('/users/profile', { first_name: 'Grace' });
    });

    it('calls profile side-effect endpoints with the expected payloads', async () => {
        vi.mocked(api.patch).mockResolvedValueOnce({ data: { user: { id_user: 7, is_face_verified: true } } });
        vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } });

        await expect(markFaceVerification()).resolves.toEqual({ id_user: 7, is_face_verified: true });
        await deleteMyAccount('Password123!');

        expect(api.patch).toHaveBeenCalledWith('/users/profile/face-verification');
        expect(api.delete).toHaveBeenCalledWith('/users/profile', { data: { password: 'Password123!' } });
    });

    it('fetches explore users with query params', async () => {
        const response = { success: true, count: 1, users: [{ id_user: 9 }], hasMore: false, nextCursor: null, limit: 20 };
        vi.mocked(api.get).mockResolvedValueOnce({ data: response });

        await expect(getExploreUsers({ city: 'Madrid', limit: 20 })).resolves.toEqual(response);

        expect(api.get).toHaveBeenCalledWith('/users/explore', { params: { city: 'Madrid', limit: 20 } });
    });

    it('marks seen profiles and moderation actions', async () => {
        vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

        await markDiscoverySeen(9, 'liked');
        await reportUser(9, 'spam');
        await blockUser(9);

        expect(api.post).toHaveBeenNthCalledWith(1, '/users/discovery/seen', { seenUserId: 9, action: 'liked' });
        expect(api.post).toHaveBeenNthCalledWith(2, '/chats/9/report', { reason: 'spam' });
        expect(api.post).toHaveBeenNthCalledWith(3, '/chats/9/block');
    });

    it('reads and updates privacy and accessibility preferences', async () => {
        const privacy = { is_visible: true, messages_only_matches: false, show_online_status: true };
        const accessibility = { contrast: 'high' as const, reduce_motion: true, font_size: 'large' as const };
        vi.mocked(api.get)
            .mockResolvedValueOnce({ data: { privacy } })
            .mockResolvedValueOnce({ data: { accessibility } });
        vi.mocked(api.patch)
            .mockResolvedValueOnce({ data: { privacy: { ...privacy, is_visible: false } } })
            .mockResolvedValueOnce({ data: { accessibility: { ...accessibility, font_size: 'xlarge' } } });

        await expect(getPrivacy()).resolves.toEqual(privacy);
        await expect(updatePrivacy({ is_visible: false })).resolves.toEqual({ ...privacy, is_visible: false });
        await expect(getAccessibilityPreferences()).resolves.toEqual(accessibility);
        await expect(updateAccessibilityPreferences({ font_size: 'xlarge' })).resolves.toEqual({ ...accessibility, font_size: 'xlarge' });

        expect(api.get).toHaveBeenNthCalledWith(1, '/users/privacy');
        expect(api.patch).toHaveBeenNthCalledWith(1, '/users/privacy', { is_visible: false });
        expect(api.get).toHaveBeenNthCalledWith(2, '/users/accessibility');
        expect(api.patch).toHaveBeenNthCalledWith(2, '/users/accessibility', { font_size: 'xlarge' });
    });
});
