/**
 * Public Dialogflow CX Messenger IDs. They are written into the page HTML.
 * They are not secret keys. Leave both blank until the embed snippet is copied.
 * Non-empty PUBLIC_DIALOGFLOW_* build values override this file.
 */

export const chatWidget = {
  projectId: 'chatbotcarinteriocleaning',
  agentId: 'd09f95ba-326a-432a-a2d2-77cdfccdbf50',
  location: 'global',
} as const;

const PROJECT_RE = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;
const AGENT_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCATION_RE = /^(global|[a-z]+(?:-[a-z0-9]+)+)$/;

export type ChatWidgetConfig = {
  projectId: string;
  agentId: string;
  location: string;
  enabled: boolean;
};

type ChatWidgetEnv = {
  PUBLIC_DIALOGFLOW_PROJECT_ID?: string;
  PUBLIC_DIALOGFLOW_AGENT_ID?: string;
  PUBLIC_DIALOGFLOW_LOCATION?: string;
};

function pick(envValue: string | undefined, fileValue: string, fallback = ''): string {
  const fromEnv = String(envValue ?? '').trim();
  if (fromEnv) return fromEnv;
  const fromFile = String(fileValue ?? '').trim();
  return fromFile || fallback;
}

export function resolveChatWidget(
  env: ChatWidgetEnv = {},
  file: { projectId: string; agentId: string; location: string } = chatWidget,
): ChatWidgetConfig {
  const projectId = pick(env.PUBLIC_DIALOGFLOW_PROJECT_ID, file.projectId);
  const agentId = pick(env.PUBLIC_DIALOGFLOW_AGENT_ID, file.agentId);
  const location = pick(env.PUBLIC_DIALOGFLOW_LOCATION, file.location, 'global');
  const enabled = PROJECT_RE.test(projectId) && AGENT_RE.test(agentId) && LOCATION_RE.test(location);
  return { projectId, agentId, location, enabled };
}
