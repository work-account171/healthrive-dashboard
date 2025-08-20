import { ListCheck } from "lucide-react"
import Link from "next/link"

type TaskCardProps={
    text:string,
    number:React.ReactNode ,
    bgColor:string,
    textColor:string,
    borderColor:string,
    link:string

}

const TaskCard: React.FC<TaskCardProps>=({text,number,bgColor,textColor,borderColor,link})=> {
  return (
    <>
    <Link href={link} className={`${bgColor} ${borderColor} w-full flex-col gap-5 flex p-[18px] rounded-xl border`}>
            <div className="flex justify-start items-start gap-3">
              <ListCheck/>
              <p className="text-xl">{text}</p>
            </div>
            <h1 className={`text-4xl  font-bold ${textColor}`}>{number}</h1>
          </Link>
    
    </>
  )
}

export default TaskCard