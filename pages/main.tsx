import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, ChangeEvent, useEffect, FormEvent } from 'react'
import { isKanji } from '../utils/isKanji'
const Main: NextPage = () => {
  const [words, setWords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState<{ meaning: string | null; reading: string | null }[]>([])
  const [currentWord, setCurrentWord] = useState<string>("")
  const [isError, setIsError] = useState<boolean>(false)
  const [isNotFound, setIsNotFound] = useState(false)

  // const [players, setPlayers] = useState<>()

  useEffect(() => {
    if (isError) {
      setTimeout(() => { setIsError(false) }, 1000)
    }
  }, [isError])

  const handleTyping = (x: ChangeEvent<HTMLInputElement>): void => {
    setCurrentWord(x.target.value)
  }

  const handleFind = () => {
    setIsLoading(true)
    let isOkay = false;
    let meaning: string | null = null;
    let reading: string | null = null;
    let kanji: string | null = null;
    const param = words.length == 0 ? '' : words[words.length - 1]
    console.log(param)
    fetch(`/api/find?word=${param}`).then((res) => res.json()).then((res) => {
      isOkay = res.OK
      meaning = res.meaning
      reading = res.reading
      kanji = res.kanji
      console.log(res)
      if (isOkay && meaning != null && kanji) {

        setWords([...words, kanji]);
        setInfo([...info, { meaning: meaning, reading: reading }]);
        setIsLoading(false)
        // setCurrentWord("")
      }
      else {
        setIsNotFound(true)
        setIsLoading(false)
      }
    })
  }

  const handleSubmit = (event: FormEvent) => {
    setIsLoading(true)
    let valid = true
    event.preventDefault();
    if (words.length > 0) {
      const lastWord = words[words.length - 1]
      if (lastWord[lastWord.length - 1] != currentWord[0]) valid = false
      if (words.lastIndexOf(currentWord) != -1) valid = false
      if (currentWord.length == 1) valid = false
      if (!isKanji(currentWord)) valid = false


    }
    let isOkay = false;
    let meaning: string | null = null;
    let reading: string | null = null;
    if (valid && isKanji(currentWord)) {
      console.log(`checking ${currentWord}`)
      fetch(`/api/check?word=${currentWord}`).then((res) => res.json()).then((res) => {
        isOkay = res.OK
        meaning = res.meaning
        reading = res.reading
        console.log(res)
        if (isOkay && meaning != null) {
          console.log(words, currentWord)
          setWords([...words, currentWord]);
          setInfo([...info, { meaning: meaning[0], reading: reading }]);
          setIsLoading(false)
          setCurrentWord("")
        }
        else {
          setIsLoading(false)
          setIsError(true)
        }
      })
    }
    else {
      setIsLoading(false)
      setIsError(true)
    }

  }
  return (
    <div className="flex w-screen min-h-screen flex-col items-center justify-center pt-5">
      <Head>
        <title>Word Chain</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="flex w-full min-h-screen pb-48 pt-5 flex-col items-center justify-center px-4 text-center gap-10">
        <table className='table-auto w-full border'>
          {/* <thead>
            <tr>
              <th>感じ</th>
              <th>意味</th>
            </tr>
          </thead> */}
          <tbody className='border'>
            {words.map((word: String, idx: number) => {
              return <tr>
                <td className='border w-1/3'>{`${word}`} </td>
                <td className='border w-1/3 overflow-scroll'><span>{info[idx].reading}</span></td>
                <td className='border w-1/3 overflow-scroll'><span>{info[idx].meaning}</span></td>
              </tr>
            })}
          </tbody>
        </table>
      </main>

      <div className='bg-white flex flex-col h-32 border-t w-full fixed bottom-0 gap-5 items-center justify-center'>
        {isLoading && <span>Checking</span>}
        {isError && <span className='text-red-500'>The kanji is not valid</span>}
        {isNotFound && <span className='text-red-500'>The kanji cannot be found</span>}

        <form className='gap-1 flex' onSubmit={handleSubmit}>
          <input type="text" className={`border rounded-md pl-2 ${isError ? 'border-red-500' : 'border-black'}`} value={currentWord.toString()} onChange={handleTyping} />
          <button disabled={isLoading} type='submit' className={` rounded-md border px-4 border-black`} onClick={handleSubmit}>Enter</button>
          {words.length > 0 && <button disabled={isLoading} type='button' className='rounded-md border px-4 border-black' onClick={handleFind}>Find</button>}
        </form>
      </div>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">

      </footer> */}
    </div >
  )
}

export default Main
