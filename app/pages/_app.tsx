import "utils/global.css"

import { AppProps, ErrorComponent, useRouter, AuthenticationError, AuthorizationError } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import { Box, ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import { theme } from "utils/theme"
import { useEffect } from "react"
import { GtagService } from "utils/tracking"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      GtagService.pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
          useSystemColorMode: false,
        }}
      >
        <ErrorBoundary
          FallbackComponent={RootErrorFallback}
          resetKeys={[router.asPath]}
          onReset={() => {
            // This ensures the Blitz useQuery hooks will automatically refetch
            // data any time you reset the error boundary
            queryCache.resetErrorBoundaries()
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof AuthenticationError) {
    return <Box />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}
