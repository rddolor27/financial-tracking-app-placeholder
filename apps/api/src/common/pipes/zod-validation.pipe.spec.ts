import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  });

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(schema);
  });

  it('should pass valid data through', () => {
    const data = { name: 'John', email: 'john@example.com' };
    expect(pipe.transform(data)).toEqual(data);
  });

  it('should throw BadRequestException for invalid data', () => {
    expect(() => pipe.transform({ name: '', email: 'invalid' })).toThrow(
      BadRequestException,
    );
  });

  it('should include field-level errors', () => {
    try {
      pipe.transform({ name: '', email: 'invalid' });
    } catch (e) {
      const response = (e as BadRequestException).getResponse() as Record<
        string,
        unknown
      >;
      expect(response.errors).toBeDefined();
      expect(Array.isArray(response.errors)).toBe(true);
    }
  });
});
