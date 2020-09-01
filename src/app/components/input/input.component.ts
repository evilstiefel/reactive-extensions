import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, publishReplay, refCount, switchMap } from 'rxjs/operators';
import { CatImage, DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  searchInput = new FormControl('', { validators: [Validators.minLength(1), Validators.required] });

  searchInput$: Observable<string>;
  catJson$: Observable<CatImage>;
  catSrc$: Observable<string>;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.searchInput$ = this.searchInput.valueChanges.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    );

    this.catJson$ = this.searchInput$.pipe(
      switchMap(text => this.dataService.fetchCat(text)),
      map(cats => cats.pop()),
      publishReplay(),
      refCount()
    );

    this.catSrc$ = this.catJson$.pipe(map(json => json.url));

  }

}
