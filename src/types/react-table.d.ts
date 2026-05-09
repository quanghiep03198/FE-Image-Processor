//add fuzzy filter to the filterFns
export declare module '@tanstack/react-table' {
  interface FilterFns {
    //  fuzzy?: FilterFn<unknown>
    inDateRange?: FilterFn<any>
  }
}
