import { Observable, OperatorFunction } from 'rxjs';
import { scan } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { UniqueElement } from './user.interfaces';

export function trackLast<T>(count: number): OperatorFunction<T, UniqueElement<T>[]> {
  return (obs: Observable<T>) => {
    return obs.pipe(
      scan((acc: UniqueElement<T>[], val: T) => {
        acc.push({id: uuid(), value: val});
        return acc.slice((-1) * count);
      }, [])
    );
  };
}
























/**
 * Ist nicht viel Code, mal ohne den "Typ-Annotation"-Zucker
 */
export const lastN = (count) => (obs) => obs.pipe(
  scan((acc: any, value) => {
    acc.push({id: uuid(), value });
    return acc.slice((-1) * count);
  }, [])
);
