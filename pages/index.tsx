import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="flex w-screen min-h-screen flex-col items-center justify-center py-5">
      <Head>
        <title>Kanji's jikan</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="flex w-full h-full flex-col items-center justify-center px-20 text-center gap-10">
        <h1 className="text-6xl font-bold">
          Kanji's jikan
        </h1>

        <div className='flex flex-col items-center justify-center'>
          <a href='/main' className='px-4 rounded-md border text-lg shadow'>Play</a>
        </div>


      </main>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">

      </footer> */}
    </div>
  )
}

export default Home
