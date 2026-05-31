'use client'

import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { ProjectDetail } from '@/type/types'
import { toast } from 'sonner'
import ProjectCard from './ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'


function ProjectList() {

    const [projectList, setProjectList] = useState<ProjectDetail[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getProjectList()
    }, [])

    const getProjectList = async () => {
        setIsLoading(true)
        
        try {
        const result = await axios.get('/api/project')
        console.log(result.data)
        setProjectList(result.data)
        toast.success('Projects list fetched successfully')
        } catch (error) {
            console.error('Failed to fetch projects list', error)
            toast.error('Failed to fetch projects list')
        } finally {
            setIsLoading(false)
        }
    }
  return (
    <div className='px-10 md:px-24 lg:px-44 xl:px-56'>
        <h2 className='font-semibold text-2xl mb-4 ml-2 text-left text-gray-900'>
            My Projects
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
            {!isLoading ? projectList.map((project) => (
                <ProjectCard key={project.id} project={project} />
            )): [1,2,3].map((item) => ((
                <div key={item} className='mb-6'>
                    <Skeleton className='h-[200px] w-full bg-gray-100' />    
                    <Skeleton className='mt-3 w-[50%] h-6' />    
                    <Skeleton className='mt-3 w-[30%] h-6' />    
                </div>
            )))}
            
            
        </div>
    </div>
  )
}

export default ProjectList