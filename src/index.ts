import * as memoizee from 'memoizee';
import { Observable, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

type ObservableFunction<T> = (...args: any[]) => Observable<T>;
export function memoizeeRx<T>(toWrap: ObservableFunction<T>, options: memoizee.Options = {}): ObservableFunction<T> {
    const disposeSymbol = Symbol('___dispose');
    const newOptions: memoizee.Options = Object.assign(
        {
            normalizer: (args: any[]) => {
                return Array.from(args);
            },
        },
        options,
        {
            dispose(value: any) {
                value[disposeSymbol]();
            },
        },
    );

    return memoizee(function(this: any, ...args: any[]) {
        const result$ = toWrap.apply(this, args);
        const expired$ = new Subject();
        const sharedResult$ = result$.pipe(
            takeUntil(expired$),
            shareReplay(),
        );
        (sharedResult$ as any)[disposeSymbol] = () => expired$.next();
        return sharedResult$;
    }, newOptions);
}
