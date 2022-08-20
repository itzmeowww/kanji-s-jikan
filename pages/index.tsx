import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div className="flex w-screen min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Kanji's jikan</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="flex w-full h-screen flex-col items-center justify-center px-20 text-center gap-10 bg-gradient-to-br from-blue-500 to-green-300">
        <h1 className="text-4xl font-bold text-white ">
          Kanji's jikan
        </h1>

        <div className='flex flex-col items-center justify-center'>
          <a href='/main' className='px-4 rounded-md border text-lg font-bold text-white shadow'>PLAY</a>
        </div>


      </main>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">

      </footer> */}
    </div>
  )
}

export default Home
