import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';


const inter = Inter({ subsets: ['latin'] })

type ScoreResult = {
  aspect: string;
  value: string;
}

type Score = {
  id: string;
  username: string;
  github_repo: string;
}


type Attempt = {
  score: ScoreResult[];
  log: string;
  ran_at: string;
}

const ExpandedComponent = ({ data }: {data: Score}) => {

  const [attemps, setAttempts] = useState<Attempt[]>([])

  async function getAttempts(id: string) {
    const supabaseUrl = 'https://iasgsxzqntbkgxocmmzm.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    supabase
      .from('attempts')
      .select('*')
      .eq('score_board_id', Number(id))
      .limit(10)
      .order('submitted_at', { ascending: false })
      .then(res => {
        console.log(res.data)
        const attemping: Attempt[] = [];
        res.data?.forEach(m => {
          attemping.push({
            score: m.scores,
            log: m.test_output,
            ran_at: m.submitted_at,
          } as Attempt);
        })
        setAttempts(attemping)
      })

  }

  useEffect(() => {
    getAttempts(data.id)
  }, [data])

  return <div className='p-4'>
    <p>Menampilkan 10 percobaan terakhir</p>
    <ul>
      {
        attemps.map(v => (
          <li className='border border-b border-black'>
            <p className='bg-gray-200'>UTC: {v.ran_at}</p>
            <ul>
              {
                v.score?.map((v) => (
                  <li>{v.aspect}  <span className={`${v.value == "PASS" ? "bg-green-500" : "bg-red-500" }`}> {v.value} </span></li>
                ))
              }
            </ul>
          </li>
        ))
      }
    </ul>
  </div>
};

const columns = [
  {
      name: 'Name',
      selector: row => row.username,
  },
  {
      name: 'Github Repo',
      selector: row => <Link href={row.github_repo}>{row.github_repo}</Link>,
  },
] as TableColumn<Score>[];


export default function Challenge() {
  const router = useRouter()

  const [challengeName, setChallengeName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [githubRepoLink, setGithubRepoLink] = useState<string>('');
  const [data, setData] = useState<Score[]>([])

  

  async function getChallengeInfo(id: string) {
    const supabaseUrl = 'https://iasgsxzqntbkgxocmmzm.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    supabase
      .from('challenge')
      .select('*')
      .eq('id', Number(id))
      .then(res => {
        setChallengeName(res?.data?.at(0).name as string)
        setDescription(res?.data?.at(0).description as string)
      })

    supabase
      .from('score_board')
      .select('*')
      .eq('challenge_id', Number(id))
      .then(res => {
        console.log(id, res)
        
        let member: Score[] = [];
        res.data?.forEach(m => {
          member.push({
            id: m.id,
            github_repo: m.github_repository,
            username: (m.github_repository as string).split("/")[3],
          } as Score);
        })
        setData(member);
        
      })
  }

  async function registerParticipant() {
    const supabaseUrl = 'https://iasgsxzqntbkgxocmmzm.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const supabase = createClient(supabaseUrl, supabaseKey)
    if (router.query.id) {
      supabase
        .from('score_board')
        .insert([
          { challenge_id: router.query.id, github_repository: githubRepoLink, scores: {}  },
        ]).then(res => {
          window.location.reload();
        })
    }
  }

  useEffect(() => {
    if (router.query.id) {
      getChallengeInfo(router.query.id as string)
    }
  }, [router.query.id])

  return (
    <><main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Majlis IT &nbsp;
          <code className="font-mono font-bold">Challenge Board</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Telegram
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <h1 className="font-mono">{challengeName}</h1>  
      </div>
  

      <div className="mb-32 grid text-center lg:mb-0 lg:text-left">
       {description}
      </div>
    </main>
        <div className='px-10'>
          <div className='pt-4'></div>
          <p>Belum ada di board ? | Daftar dengan mengisi link github repo</p>
          <div className='pb-2'></div>
          <input className='text-black w-1/2' type='text' placeholder='github repo link' onChange={(e) => {setGithubRepoLink(e.target.value)}}/>
          <button onClick={() => {registerParticipant()}} className='bg-gray-500 rounded-md px-2'>Daftar</button>
          <div className='pb-2'></div>
          <hr/>

          <pre>click tanda panah pada row untuk melihat hasil pengerjaan challenge</pre>
          <hr/>
          <div className='pb-4'></div>

          <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
          />
        </div>


      </>
  )
}
