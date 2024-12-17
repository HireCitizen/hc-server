import { CrewRole } from "./Job"

export type FormData = {
  title: string
  description: string
  jobType: string
  amountPaid: number | ""
  payType: string
  jobStart: number
  estimatedTime: number
  timezone: string
  jobPrivacy: "PUBLIC" | "FRIENDS" | "ORG"
  reputationGate: boolean
  crewRoles: CrewRole[]
}
