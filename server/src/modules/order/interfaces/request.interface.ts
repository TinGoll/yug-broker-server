export interface IRequest<T extends any = any> {
  /** Получить одну запись */
  one(): this;
  /** Получить массив записей */
  many(): this;
  /** Условие выборки */
  where(options: Partial<T>, like: boolean): this;
  /** Лимит записей */
  limit(value: number): this;
  /** Пропустить записи */
  skip(value: number): this;
  /** Сортировка */
  orderBy(options: Partial<T>, collate: 'ASC' | 'DESC'): this;
  /** Сборка запроса */
  build(): string;
}
