// Parameter: Authorization
// Format: Bearer ${token}

import {
	Box,
	Button,
	Heading,
	Text,
	HStack,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";

import { TicketData } from "../interfaces/TicketData";

interface TicketCardProps {
	ticket: TicketData;
	deleteTicket: (id: number) => Promise<any>;
}

const TicketCard = ({ ticket, deleteTicket }: TicketCardProps) => {
	const [{ isDragging }, drag] = useDrag({
		type: "TICKET",
		item: ticket,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const ticketId = Number(event.currentTarget.value);
		if (!isNaN(ticketId)) {
			try {
				await deleteTicket(ticketId);
			} catch (error) {
				console.error("Failed to delete ticket:", error);
			}
		}
	};

	return (
		<Box
			ref={drag}
			bg={useColorModeValue("white", "whiteAlpha.200")}
			p={4}
			borderRadius="md"
			boxShadow="sm"
			opacity={isDragging ? 0.5 : 1}
			borderWidth="1px"
			borderColor={useColorModeValue("gray.200", "whiteAlpha.300")}
			_hover={{
				transform: "translateY(-2px)",
				boxShadow: "md",
			}}
			transition="all 0.2s"
		>
			<VStack align="stretch" spacing={2}>
				<Heading size="sm" color={useColorModeValue("gray.700", "white")}>
					{ticket.name}
				</Heading>
				<Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
					{ticket.description}
				</Text>
				<Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
					{ticket.createdBy?.username}
				</Text>
				<HStack spacing={2} justify="flex-end">
					<Button
						as={Link}
						to="/edit"
						state={{ id: ticket.id }}
						size="sm"
						bg="blue.600"
						color="white"
						_hover={{
							bg: "blue.700",
							transform: "translateY(-1px)",
							boxShadow: "md",
						}}
						_active={{
							bg: "blue.800",
							transform: "translateY(0)",
						}}
					>
						Edit
					</Button>
					<Button
						size="sm"
						variant="ghost"
						color="red.600"
						_hover={{
							bg: "red.50",
							color: "red.700",
						}}
						value={String(ticket.id)}
						onClick={handleDelete}
					>
						Delete
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

export default TicketCard;
