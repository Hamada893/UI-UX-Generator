import { ProjectDetail } from '@/type/types'
import Image from 'next/image'
import Link from 'next/link'


type Props = {
    project: ProjectDetail
}

function ProjectCard({project}: Props) {
  return (
    <Link href={`/project/${project.projectId}`} className='block'>
        <div className='rounded-2xl mb-6 p-4 border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all duration-300'>
            <Image 
                src={project?.screenshot ?? '/images/project-screenshot.png'} 
                alt={project?.projectName ?? 'Project Screenshot'} 
                width={300} 
                height={200} 
                className='rounded-xl object-contain h-[200px] w-full bg-black'
            />

            <div className='p-2'>
                <h2>{project?.projectName}</h2>
                <p className='text-sm text-gray-500'>{project?.createdOn}</p>
            </div>
        </div>
    </Link>
  )
}

export default ProjectCard