import React, { createContext as createContextReact, ReactNode, useContext as useContextReact, useMemo } from 'react'

const createContext = <ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) => {
  const Context = createContextReact<ContextValueType | undefined>(defaultContext)
  Context.displayName = 'Context'

  const Provider = (props: ContextValueType & { children: ReactNode }) => {
    const { children, ...context } = props

    const value = useMemo(() => {
      return context
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, Object.values(context)) as ContextValueType

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  const useContext = (consumerName: string) => {
    const context = useContextReact(Context)
    if (context) return context
    if (defaultContext !== undefined) return defaultContext
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
  }

  Provider.displayName = rootComponentName + 'Provider'
  return [Provider, useContext] as const
}

export default createContext
