export interface RequestMetadata {
    pagination: RequestPaginationMetadata
}

export interface ResponseMetadata {
    pagination: ResponsePaginationMetadata
}

export interface RequestPaginationMetadata {
    limit: number
    page: number
}

export interface ResponsePaginationMetadata {
    limit: number
    page: number
    totalPages: number
    totalItems: number
}
