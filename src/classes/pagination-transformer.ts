type PaginationTransformerOptionType = {
  page?: number
  pageSize?: number
}

export default class PaginationTransformer {
  page: number = 1
  pageSize: number
  data: any[]

  constructor(data: any[] = [], options: PaginationTransformerOptionType = {}) {
    this.page = options.page || 1
    this.pageSize = options.pageSize || 10
    this.data = data
  }

  static paginate(data: any[], options: PaginationTransformerOptionType = {}) {
    return new PaginationTransformer(data, options)
  }

  get currentPageData() {
    const start = (this.page - 1) * this.pageSize
    const end = start + this.pageSize
    return this.data.slice(start, end)
  }

  get totalPages() {
    return Math.ceil(this.total / this.pageSize)
  }

  get total() {
    return this.data.length
  }
}
