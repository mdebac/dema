export type SearchCriteria = Record<
  string,
  string | number | boolean | ReadonlyArray<string | number | boolean>
> & {
  page?: number;
  size?: number;
  sort?: string
};

export class Page<T> {
  content: T[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  size: number = 0;
  number: number = 0;
  first: boolean = true;
  last: boolean = true;

  static empty<T>(): Page<T> {
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: 0,
      size: 0,
      first: true,
      last: true,
    };
  }

  static createPageObjectList<T>(list: T[],
                                 totalPages: number,
                                 totalElements: number,
                                 number: number,
                                 size: number,
                                 first: boolean,
                                 last: boolean): Page<T> {
    return {
      content: list,
      totalPages: totalPages,
      totalElements: totalElements,
      number: number,
      size: size,
      first: first,
      last: last,
    };
  }

  static createMockPageObjectList<T>(list: T[]): Page<T> {
    return {
      content: list,
      totalPages: 0,
      totalElements: 0,
      number: 0,
      size: 0,
      first: true,
      last: true,
    };
  }

}
