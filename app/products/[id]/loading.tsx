export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#F8F4EE] pt-32">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-3 w-48 bg-[#D4C4B0]/50 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square bg-[#D4C4B0]/40" />
          <div className="space-y-5">
            <div className="h-4 w-32 bg-[#D4C4B0]/50" />
            <div className="h-12 w-3/4 bg-[#D4C4B0]/50" />
            <div className="h-6 w-1/3 bg-[#D4C4B0]/50" />
            <div className="h-24 w-full bg-[#D4C4B0]/40" />
          </div>
        </div>
      </div>
    </main>
  )
}
