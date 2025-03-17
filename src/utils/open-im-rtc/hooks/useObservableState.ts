import type { Observable } from 'rxjs'
import { UnwrapRef, onUnmounted, ref } from 'vue'

export function useObservableState<T>(observable: Observable<T>, startWith: T) {
  const state = ref<T>(startWith)
  const subscription = observable.subscribe(
    (value) => (state.value = value as UnwrapRef<T>),
  )

  onUnmounted(() => {
    subscription.unsubscribe()
  })
  return state
}
