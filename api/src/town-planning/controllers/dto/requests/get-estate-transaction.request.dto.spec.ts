import { GetEstateTransactionRequestDto } from '.';
import { validate } from 'class-validator';

describe('GetEstateTransactionRequestDto', () => {
  it('should be defined', () => {
    expect(GetEstateTransactionRequestDto).toBeDefined();
  });

  it('should has no validate errors when all fields are valid', async () => {
    const dto = new GetEstateTransactionRequestDto();
    dto.year = 2015;
    dto.prefCode = 13;
    dto.type = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate year when year is before 2009', async () => {
    const dto = new GetEstateTransactionRequestDto();
    dto.year = 2008;

    const errors = await validate(dto);
    const yearError = errors.find((error) => error.property === 'year');

    expect(yearError?.constraints).toHaveProperty('min');
    expect(yearError?.constraints?.min).toBe('Year must be after 2008');
  });

  it('should validate year when year is after 2021', async () => {
    const dto = new GetEstateTransactionRequestDto();
    dto.year = 2022;

    const errors = await validate(dto);
    const yearError = errors.find((error) => error.property === 'year');

    expect(yearError?.constraints).toHaveProperty('max');
    expect(yearError?.constraints?.max).toBe('Year must be before 2022');
  });

  it('should validate prefCode when prefCode is not a valid Kanto prefecture code', async () => {
    const dto = new GetEstateTransactionRequestDto();
    dto.prefCode = 15;

    const errors = await validate(dto);
    const prefCodeError = errors.find((error) => error.property === 'prefCode');

    expect(prefCodeError?.constraints).toHaveProperty('isIn');
    expect(prefCodeError?.constraints?.isIn).toBe(
      'Prefecture code must be a valid Kanto prefecture code',
    );
  });

  it('should validate type when type is not a valid type', async () => {
    const dto = new GetEstateTransactionRequestDto();
    dto.type = 3;

    const errors = await validate(dto);
    const typeError = errors.find((error) => error.property === 'type');

    expect(typeError?.constraints).toHaveProperty('isIn');
    expect(typeError?.constraints?.isIn).toBe(
      'Type must be a valid type (1, 2)',
    );
  });

  it('should validate all fields when all fields are required', async () => {
    const dto = new GetEstateTransactionRequestDto();

    const errors = await validate(dto);
    const yearError = errors.find((error) => error.property === 'year');
    const prefCodeError = errors.find((error) => error.property === 'prefCode');
    const typeError = errors.find((error) => error.property === 'type');

    expect(yearError?.constraints).toHaveProperty('isNotEmpty');
    expect(yearError?.constraints?.isNotEmpty).toBe('Year is required');
    expect(prefCodeError?.constraints).toHaveProperty('isNotEmpty');
    expect(prefCodeError?.constraints?.isNotEmpty).toBe(
      'Prefecture code is required',
    );
    expect(typeError?.constraints).toHaveProperty('isNotEmpty');
    expect(typeError?.constraints?.isNotEmpty).toBe('Type is required');
  });
});
