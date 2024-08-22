import Header2 from '@/app/components/Header2'
export default function About() {
  return (
    <>
      <Header2 />
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <p className="mb-5 mt-4">
          Hi, I'm John-George — a software engineer in Pittsburgh, PA. Currently, I'm a senior front-end engineer at{" "}

          where we're helping students with their college search.
        </p>
        <p className="mb-5">
          Outside of work, you can find me chasing the perfect cup of coffee at home and coffee shops in the city. My favorite drink is a pour over made with washed Ethiopian beans.
        </p>
      </div>
    </>
  )
}
