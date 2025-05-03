import { SetMetadata } from '@nestjs/common';
import { SKIP_JWT_AUTH_KEY } from '../guards/jwt-auth.guard';

export const SkipJwtAuth = () => SetMetadata(SKIP_JWT_AUTH_KEY, true);