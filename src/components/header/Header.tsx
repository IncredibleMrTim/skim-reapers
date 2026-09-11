import { Navbar } from "../Navbar"
import { Hero } from "../hero/Hero"

export const Header = () => {
  return (
    <section
      id="home"
      className="relative flex w-full flex-col grow-0 h-190 md:h-164 overflow-hidden"
    >
      <div className="w-full">
        <Navbar />
      </div>

      <Hero />
    </section>
  )
}
