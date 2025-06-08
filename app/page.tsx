"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import AuthWrapper from "@/components/AuthWrapper"

export default function Home() {
  return (
    <Provider store={store}>
      <AuthWrapper />
    </Provider>
  )
}
