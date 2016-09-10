export interface FileHandle<T> {
  name: string
  uri: string
  buffer: T
}
