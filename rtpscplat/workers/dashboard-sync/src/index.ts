import manifest from './generated/dashboard-manifest.json';

export interface Env {
    DASHBOARD_NAME: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === '/api/sync-status') {
            return Response.json({
                dashboard: env.DASHBOARD_NAME,
                synced: true,
                manifest
            });
        }

        return new Response('rtpsc-dashboard-sync online', { status: 200 });
    }
};
