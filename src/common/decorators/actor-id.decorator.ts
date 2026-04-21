import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActorId = createParamDecorator((_: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<{ headers?: Record<string, string | string[] | undefined> }>();
  const actorHeader = req.headers?.['x-user-id'];
  if (Array.isArray(actorHeader)) {
    return actorHeader[0] ?? 'system';
  }
  return actorHeader || 'system';
});
