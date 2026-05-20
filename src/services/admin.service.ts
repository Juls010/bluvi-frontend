import api from './api';

export interface AdminUser {
    id_user: number;
    email: string;
    first_name: string;
    last_name: string;
    description?: string | null;
    role: 'user' | 'admin';
    is_verified: boolean;
    is_face_verified: boolean;
    is_visible: boolean;
    created_at?: string;
}

export interface AdminReport {
    id_report: number;
    reason: string;
    status: string;
    id_message?: number | null;
    action_taken_at?: string | null;
    reported_message_content?: string | null;
    reported_message_type?: 'text' | 'audio' | 'image' | null;
    reported_message_deleted_at?: string | null;
    date: string;
    reporter_email: string;
    reported_email: string;
    reported_name: string;
    reported_last_name?: string;
}

export interface AdminBlock {
    id_block: number;
    date: string;
    blocker_email: string;
    blocked_email: string;
    blocked_name: string;
}

export interface AdminOverview {
    stats: {
        users: number;
        admins: number;
        reports: number;
        blocks: number;
    };
    users: AdminUser[];
    reports: AdminReport[];
    blocks: AdminBlock[];
}

export interface AdminMetricPoint {
    date: string;
    label: string;
    count: number;
}

export interface AdminStatusMetric {
    status: string;
    count: number;
}

export interface AdminMetrics {
    reportsByDay: AdminMetricPoint[];
    registrationsByDay: AdminMetricPoint[];
    deletedAccountsByDay: AdminMetricPoint[];
    reportsByStatus: AdminStatusMetric[];
}

export interface CreateAdminUserPayload {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    is_verified: boolean;
}

export type BadgeFilter = 'all' | 'verified' | 'unverified';

export const adminService = {
    getOverview: async () => {
        const response = await api.get<AdminOverview & { success: boolean }>('/admin/overview');
        return response.data;
    },

    listUsers: async (search = '', badge: BadgeFilter = 'all') => {
        const response = await api.get<{ success: boolean; users: AdminUser[] }>('/admin/users', {
            params: {
                ...(search ? { search } : {}),
                ...(badge !== 'all' ? { badge } : {}),
            },
        });
        return response.data.users;
    },

    getMetrics: async () => {
        const response = await api.get<{ success: boolean; metrics: AdminMetrics }>('/admin/metrics');
        return response.data.metrics;
    },

    createUser: async (payload: CreateAdminUserPayload) => {
        const response = await api.post<{ success: boolean; user: AdminUser }>('/admin/users', payload);
        return response.data.user;
    },

    updateUser: async (userId: number, payload: Partial<Pick<AdminUser, 'first_name' | 'last_name' | 'description' | 'role' | 'is_verified' | 'is_face_verified' | 'is_visible'>>) => {
        const response = await api.patch<{ success: boolean; user: AdminUser }>(`/admin/users/${userId}`, payload);
        return response.data.user;
    },

    deleteUser: async (userId: number) => {
        await api.delete(`/admin/users/${userId}`);
    },

    listReports: async () => {
        const response = await api.get<{ success: boolean; reports: AdminReport[] }>('/admin/reports');
        return response.data.reports;
    },

    dismissReport: async (reportId: number) => {
        await api.patch(`/admin/reports/${reportId}/dismiss`);
    },

    warnReportUser: async (reportId: number) => {
        await api.patch(`/admin/reports/${reportId}/warn`);
    },

    removeReportContent: async (reportId: number) => {
        await api.patch(`/admin/reports/${reportId}/remove-content`);
    },

    listBlocks: async () => {
        const response = await api.get<{ success: boolean; blocks: AdminBlock[] }>('/admin/blocks');
        return response.data.blocks;
    },
};
