import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly repository: IDeliveryRepository,
  ) {}

  async execute(id: number): Promise<Result<Delivery, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Delivery', id));
    return ok(result.value);
  }
}
