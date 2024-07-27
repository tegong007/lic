import type { Router } from 'vue-router';
import { createPageTitleGuard } from './page-title-guard';

export function setupRouterGuards(router: Router) {
  createPageTitleGuard(router);
}
