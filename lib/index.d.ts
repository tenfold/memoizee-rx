import * as memoizee from 'memoizee';
import { Observable } from 'rxjs';
declare type ObservableFunction<T> = (...args: any[]) => Observable<T>;
declare type MemoizedObservableFunction<T> = ObservableFunction<T> & memoizee.Memoized<ObservableFunction<T>>;
export declare function memoizeeRx<T>(toWrap: ObservableFunction<T>, options?: memoizee.Options): MemoizedObservableFunction<T>;
export {};
