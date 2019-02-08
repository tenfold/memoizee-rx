import { concat, Observable, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { memoizeeRx } from '../src/index';

const delay = (ms: number) => new Promise((resolve, reject) => setTimeout(resolve, ms));

describe('memoizeeRx', () => {
  it('should memoizee an rx stream', async () => {
    const implementation = jest.fn((x: number) => {
      return concat(of(x*2), of(x*3), of(x*4));
    });
    const f = memoizeeRx(implementation);

    const out = await f(2).pipe(toArray()).toPromise();
    const out2 = await f(2).pipe(toArray()).toPromise();

    expect(out).toEqual([4, 6, 8]);
    expect(out2).toEqual([4, 6, 8]);
    expect(implementation).toHaveBeenCalledTimes(1);
  });

  it('should support timeout', async () => {
    const implementation = jest.fn((x: number) => {
      return concat(of(x*2), of(x*3), of(x*4));
    });
    const f = memoizeeRx(implementation, { maxAge: 1 });
    const out = await f(2).pipe(toArray()).toPromise();
    await delay(2);
    const out2 = await f(2).pipe(toArray()).toPromise();

    expect(out).toEqual([4, 6, 8]);
    expect(out2).toEqual([4, 6, 8]);
    expect(implementation).toHaveBeenCalledTimes(2);
  });

  it('should unsubscribe from source upon cleanup', async () => {
    const onSubscribe = jest.fn();
    const f = memoizeeRx(() => {
      return new Observable(subscriber => {
        subscriber.next('a');

        return {
          unsubscribe: onSubscribe,
        };
      });
    }, { maxAge: 1 });

    const promise = f(2).pipe(toArray()).toPromise();
    await delay(2);
    f(2).pipe(toArray()).toPromise();

    const out = await promise;
    expect(out).toEqual(['a']);
    expect(onSubscribe).toHaveBeenCalledTimes(1);
  });
});