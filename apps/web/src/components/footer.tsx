export const Footer = () => {
  return (
    <footer className="text-center py-6 mt-auto border-t">
      <img src="/logo.svg" alt="Logo" className="h-8 mx-auto mb-3 grayscale" />
      <small className="text-muted-foreground">
        CRONOLINK &copy; {new Date().getFullYear()} All rights reserved.
      </small>
    </footer>
  )
}