import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindDeliveryUseCase {
  constructor(
    @Inject(DI_TOKENS.DELIVERY_REPOSITORY)
    private readonly repository: DeliveryRepositoryPort,
  ) {}

  async execute(id: number): Promise<Result<Delivery, AppError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Delivery', id));
    return ok(result.value);
  }
}
