import * as memoizee from 'memoizee';
import { Observable } from 'rxjs';
declare type ObservableFunction<T> = (...args: any[]) => Observable<T>;
export declare function memoizeeRx<T>(toWrap: ObservableFunction<T>, options?: memoizee.Options): ObservableFunction<T>;
export {};
