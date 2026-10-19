"use client"
import { PortableText } from "@portabletext/react"
import { Header } from "@/components/header/Header"
import { PageContainer } from "@/components/PageContainer"
import { PORTABLE_TEXT_COMPONENTS } from "@/components/portableText/marks"
import { CtaButtons } from "@/components/CtaButtons"
import { useLiveSanityData } from "@/sanity/live"
import { workWithUsPageQuery } from "@/sanity/queries"
import type { WorkWithUsPageQueryResult } from "@/sanity/types"
import { dateFormat } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WorkWithUsClientProps {
  initialData: WorkWithUsPageQueryResult
}

const renderVacancies = (
  vacancies: NonNullable<NonNullable<WorkWithUsPageQueryResult>["vacancies"]>,
) => {
  return vacancies.map((v) => (
    <div
      key={v._key}
      className="flex flex-col gap-4 backdrop-blur-lg bg-white/2 rounded border p-4"
    >
      {v.heading && (
        <h4 className="text-brand-accent font-bold">{v.heading}</h4>
      )}
      {v.date && <p>{dateFormat.format(new Date(v.date))}</p>}
      {v.description && (
        <PortableText
          value={v.description}
          components={PORTABLE_TEXT_COMPONENTS}
        />
      )}
      {v.applyButton && (
        <div className="w-full flex justify-end">
          <CtaButtons buttons={v.applyButton} />
        </div>
      )}
    </div>
  ))
}

export const WorkWithUsClient = ({ initialData }: WorkWithUsClientProps) => {
  const query = useLiveSanityData(workWithUsPageQuery, initialData)

  return (
    <>
      <Header
        hero={query?.hero ?? undefined}
        showHeroImageOnMobile={false}
        showHeroTextOnMobile={false}
      />
      <PageContainer
        hero={query?.hero ?? undefined}
        fillHeight
        heading={query?.heading}
        showHeading={query?.showHeading}
        pageDescription={query?.pageDescription}
        footer={query?.buttons && <CtaButtons buttons={query.buttons} />}
      >
        {query?.content && (
          <PortableText
            value={query.content}
            components={PORTABLE_TEXT_COMPONENTS}
          />
        )}
        <div className="mt-6">
          {query?.vacancies && query?.vacancies?.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-brand-accent text-lg font-bold">
                {query.vacanciesHeading}
              </h2>
              <div className="flex flex-col gap-4 ">
                {renderVacancies(query.vacancies)}
              </div>
            </div>
          ) : (
            query?.noVacanciesMessage && (
              <PortableText
                value={query.noVacanciesMessage}
                components={PORTABLE_TEXT_COMPONENTS}
              />
            )
          )}
        </div>
      </PageContainer>
    </>
  )
}
