import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { GameInstructions } from './GameInstructions'
import { Button } from './ui/button'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Image from 'next/image'

export const Header = () => {
  return (
    <div className="flex items-center justify-between p-3 font-joti fixed top-0 left-0 right-0 w-full">
      <div>
        <Link href="/">
          <Image
            src="/assets/images/logo-lg.png"
            width={79}
            height={54}
            alt="logo"
          />
        </Link>
      </div>
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
            >
              <InfoCircledIcon />
              Instructions
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[90vw] overflow-auto">
            <DialogHeader></DialogHeader>
            <DialogTitle></DialogTitle>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
              <GameInstructions />
            </div>
            <DialogDescription></DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
