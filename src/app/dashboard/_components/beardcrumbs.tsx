"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

const BeardCrumbs = () => {
  const pathname = usePathname()
  const pathsList = pathname.split("/").filter(Boolean)
  let prevPath = ""

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathsList.map((path, index) => {
          prevPath = prevPath + "/" + path
          return (
            <Fragment key={index}>
              <BreadcrumbItem key={index} className="hidden md:block">
                {index < pathsList.length - 1 ? (
                  <BreadcrumbLink href={prevPath} className="capitalize">
                    {path}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="capitalize">{path}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < pathsList.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BeardCrumbs
