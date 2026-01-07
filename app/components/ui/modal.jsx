import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from '@nextui-org/react'

export default function ActionModal({
	triggerStyle,
	triggerTitle,
	title,
	content,
	actions,
	onPress,
	actionString,
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<Button {...triggerStyle} onPress={onOpen}>
				{triggerTitle || 'Open Modal'}
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
							<ModalBody>{content}</ModalBody>
							<ModalFooter>
								{actions || (
									<>
										<Button color="default" variant="flat" onPress={onPress}>
											{actionString}
										</Button>
										<Button color="danger" variant="flat" onPress={onClose}>
											Close
										</Button>
									</>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
