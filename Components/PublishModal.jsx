import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";

const PublishModal = ({ onOpen }) => {
    // const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const [scrollBehavior, setScrollBehavior] = React.useState("inside");
    // const [open, setOpen] = useState(false);

    // return (
    //     <div className="flex flex-col gap-2 h[100vh]">
    //         <Modal
    //             isOpen={isOpen}
    //             size="full"
    //             height="100vh"
    //             placement="center"
    //             backdrop={"blur"}
    //             onOpenChange={onOpenChange}
    //             scrollBehavior={scrollBehavior}
    //             classNames={{
    //                 body: "h-[100vh]",
    //             }}


    //         >
    //             <ModalContent className=' '>
    //                 {(onClose) => (
    //                     <>
    //                         <ModalHeader className="flex flex-col gap-1  ">
    //                             Modal Title
    //                         </ModalHeader>
    //                         <ModalBody className=''>
    //                             <div>
    //                                 <input type="text" placeholder='hello' />
    //                             </div>
    //                             <p>
    //                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //                                 Nullam pulvinar risus non risus hendrerit venenatis.
    //                                 Pellentesque sit amet hendrerit risus, sed porttitor quam.
    //                             </p>
    //                             <p>
    //                                 Magna exercitation reprehenderit magna aute tempor cupidatat
    //                                 consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
    //                                 incididunt cillum quis. Velit duis sit officia eiusmod Lorem
    //                                 aliqua enim laboris do dolor eiusmod. Et mollit incididunt
    //                                 nisi consectetur esse laborum eiusmod pariatur proident Lorem
    //                                 eiusmod et. Culpa deserunt nostrud ad veniam.
    //                             </p>
    //                             <p>
    //                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //                                 Nullam pulvinar risus non risus hendrerit venenatis.
    //                                 Pellentesque sit amet hendrerit risus, sed porttitor quam.
    //                                 Magna exercitation reprehenderit magna aute tempor cupidatat
    //                                 consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
    //                                 incididunt cillum quis. Velit duis sit officia eiusmod Lorem
    //                                 aliqua enim laboris do dolor eiusmod. Et mollit incididunt
    //                                 nisi consectetur esse laborum eiusmod pariatur proident Lorem
    //                                 eiusmod et. Culpa deserunt nostrud ad veniam.
    //                             </p>
    //                             <p>
    //                                 Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
    //                                 duis sit officia eiusmod Lorem aliqua enim laboris do dolor
    //                                 eiusmod. Et mollit incididunt nisi consectetur esse laborum
    //                                 eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
    //                                 nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
    //                                 adipiscing elit. Nullam pulvinar risus non risus hendrerit
    //                                 venenatis. Pellentesque sit amet hendrerit risus, sed
    //                                 porttitor quam. Magna exercitation reprehenderit magna aute
    //                                 tempor cupidatat consequat elit dolor adipisicing. Mollit
    //                                 dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
    //                                 officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
    //                                 mollit incididunt nisi consectetur esse laborum eiusmod
    //                                 pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
    //                                 veniam.
    //                             </p>
    //                             <p>
    //                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //                                 Nullam pulvinar risus non risus hendrerit venenatis.
    //                                 Pellentesque sit amet hendrerit risus, sed porttitor quam.
    //                             </p>
    //                             <p>
    //                                 Magna exercitation reprehenderit magna aute tempor cupidatat
    //                                 consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
    //                                 incididunt cillum quis. Velit duis sit officia eiusmod Lorem
    //                                 aliqua enim laboris do dolor eiusmod. Et mollit incididunt
    //                                 nisi consectetur esse laborum eiusmod pariatur proident Lorem
    //                                 eiusmod et. Culpa deserunt nostrud ad veniam.
    //                             </p>
    //                             <p>
    //                                 Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit
    //                                 duis sit officia eiusmod Lorem aliqua enim laboris do dolor
    //                                 eiusmod. Et mollit incididunt nisi consectetur esse laborum
    //                                 eiusmod pariatur proident Lorem eiusmod et. Culpa deserunt
    //                                 nostrud ad veniam. Lorem ipsum dolor sit amet, consectetur
    //                                 adipiscing elit. Nullam pulvinar risus non risus hendrerit
    //                                 venenatis. Pellentesque sit amet hendrerit risus, sed
    //                                 porttitor quam. Magna exercitation reprehenderit magna aute
    //                                 tempor cupidatat consequat elit dolor adipisicing. Mollit
    //                                 dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
    //                                 officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et
    //                                 mollit incididunt nisi consectetur esse laborum eiusmod
    //                                 pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
    //                                 veniam.
    //                             </p>
    //                         </ModalBody>
    //                     </>
    //                 )}
    //             </ModalContent>
    //         </Modal>
    //     </div>
    // );
}

export default PublishModal