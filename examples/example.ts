import { Observable } from "rxjs";

abstract class ApiService {
  abstract getData(): Promise<Data>;
  abstract getData(): Observable<Data>;
}


interface Data {
  bla: number;
}

http.get('/api/data', (result) => {
  console.log(result);
});

http.get('/api/data', (result) => {
  model.processUpdate(result, newModel => {
    ui.update(newModel, ref => {
      ref.animations.run(() => {
        // und so weiter
      });
    });
  });
});
const result: Promise<Response> = fetch('/api/data');

// HTTP-Request im Hintergrund
// irgendwann später
result.then(data => { ... });

// hier wird das Ergebnis sofort berechnet
const eagerResult = 1 + 2;

// hier nur bei Gebrauch
const lazyResult = () => 1 + 2;

// Um das Ergebnis zu bekommen, müssen wir die Funktion aufrufen
console.log(lazyResult());

const getData = () => fetch('/api/data');
getData().then(data => console.log(data));

// Später...
getData().then(freshData => console.log(freshData));

const obs = new Observable(subscriber => {
  http.get('/api/data', result => {
    subscriber.next(result);
  });
});

// Um ein Observable "aufzurufen", abonnieren wir es
obs.subscribe(result => console.log(result));

// Nochmaliges abonnieren berechnet den Wert erneut
obs.subscribe(result => console.log('nochmal:', result));

const timer$ = new Observable(subscriber => {
  // Jede Sekunde ein Wert, unbegrenzt
  const timer = setInterval(() => subscriber.next(), 1000);
  // Wird aufgerufen, wenn der Subscriber das Abo kündigt
  return () => {
    clearInterval(timer);
  };
});

const source$ = Observable.from([1, 2, 3]);
// Jeden Wert von source$ verdoppeln
const mapped$ = source$.pipe(map(value => value * 2));
mapped$.subscribe(v => console.log(v));
// 2, 4, 6

const source$ = Observable.from([1, 2, 3]);
const mapped$ = source$.pipe(
  map(value => http.get<Data>(`/data?id=${value}`))
);

// Welchen Typ hat mapped$?
// Observable<Observable<Data>>

const source$ = Observable.from([1, 2, 3]);
const inOrder$ = source$.pipe(
  map(id => http.get<Data>(`/data?id=${id}`)),
  concatAll()
);

const source$ = Observable.from([1, 2, 3]);
const inOrder$ = source$.pipe(
  concatMap(id => http.get<Data>(`/data?id=${id}`))
);