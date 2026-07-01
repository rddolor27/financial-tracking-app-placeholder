import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { SubscriptionsService } from './subscriptions.service';
import { InjectSubscriptionsService } from './subscriptions.service';

export const REQUIRED_FEATURE_KEY = 'required_feature';

export function RequireFeature(feature: string) {
  return (_target: object, _propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(REQUIRED_FEATURE_KEY, feature, descriptor.value);
    }
    return descriptor;
  };
}

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectSubscriptionsService() private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.get<string>(
      REQUIRED_FEATURE_KEY,
      context.getHandler(),
    );

    if (!requiredFeature) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) return false;

    const hasFeature = await this.subscriptionsService.hasFeature(userId, requiredFeature);
    if (!hasFeature) {
      throw new ForbiddenException(`This feature requires a premium subscription: ${requiredFeature}`);
    }

    return true;
  }
}
