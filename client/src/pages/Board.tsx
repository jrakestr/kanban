import { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	Flex,
	Grid,
	Heading,
	Input,
	Select,
	IconButton,
	VStack,
} from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { retrieveTickets, deleteTicket, updateTicket } from "../api/ticketAPI";
import ErrorPage from "./ErrorPage";
import Swimlane from "../components/Swimlane";
import { TicketData } from "../interfaces/TicketData";
import { ApiMessage } from "../interfaces/ApiMessage";
import auth from "../utils/auth";

const boardStates = ["Todo", "In Progress", "Done"];

const Board = () => {
	const [tickets, setTickets] = useState<TicketData[]>([]);
	const [error, setError] = useState(false);
	const [loginCheck, setLoginCheck] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Use Chakra-provided color mode values for background/input styling.
	const bgColor = "white"; // You can replace this with: useColorModeValue("white", "gray.800")
	const textColor = "gray.700"; // Or use useColorModeValue("gray.700", "white")
	const inputBgColor = "white";

	const checkLogin = () => {
		if (auth.loggedIn()) {
			setLoginCheck(true);
		}
	};

	const fetchTickets = async () => {
		try {
			const data = await retrieveTickets();
			setTickets(data);
		} catch (err) {
			console.error("Failed to retrieve tickets:", err);
			setError(true);
		}
	};

	const deleteIndvTicket = async (ticketId: number): Promise<ApiMessage> => {
		try {
			const data = await deleteTicket(ticketId);
			fetchTickets();
			return data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const handleDrop = async (ticketId: number, newStatus: string) => {
		try {
			console.log("Handling drop:", { ticketId, newStatus });
			const ticket = tickets.find((t) => t.id === ticketId);
			if (!ticket) {
				console.error("Ticket not found:", ticketId);
				return;
			}

			// Optimistically update the UI
			const updatedTickets = tickets.map((t) =>
				t.id === ticketId ? { ...t, status: newStatus } : t
			);
			setTickets(updatedTickets);

			// Update the backend
			await updateTicket(ticketId, { ...ticket, status: newStatus });
			// Refresh the board to ensure sync
			await fetchTickets();
		} catch (err) {
			console.error("Failed to update ticket status:", err);
			setError(true);
			fetchTickets();
		}
	};

	useLayoutEffect(() => {
		checkLogin();
	}, []);

	useEffect(() => {
		if (loginCheck) {
			fetchTickets();
		}
	}, [loginCheck]);

	if (error) {
		return <ErrorPage />;
	}

	return (
		<Container maxW="container.xl" py={8}>
			{!loginCheck ? (
				<VStack spacing={10} align="center" justify="center" minH="60vh">
					<Heading size="xl" color={textColor}>
						Login to create & view tickets
					</Heading>
				</VStack>
			) : (
				<Box bg={bgColor} borderRadius="lg" p={6} shadow="base">
					<VStack spacing={6} align="stretch">
						{/* Header */}
						<Flex justify="space-between" align="center">
							<Heading size="lg" color={textColor}>
								Project Board
							</Heading>
							<Button
								as={Link}
								to="/create"
								bg="blue.600"
								color="white"
								size="md"
								_hover={{
									bg: "blue.700",
									transform: "translateY(-2px)",
									boxShadow: "lg",
								}}
								_active={{
									bg: "blue.800",
									transform: "translateY(0)",
								}}
							>
								Create Ticket
							</Button>
						</Flex>

						{/* Controls */}
						<Flex gap={4} wrap="wrap">
							<Input
								placeholder="Search tickets..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								maxW="300px"
								bg={inputBgColor}
								borderWidth={1}
								_focus={{
									borderColor: "blue.400",
									boxShadow: "none",
								}}
							/>
							<Select
								value={sortBy}
								onChange={(e) =>
									setSortBy(e.target.value as "name" | "createdAt")
								}
								maxW="200px"
								bg={inputBgColor}
								borderWidth={1}
								_focus={{
									borderColor: "blue.400",
									boxShadow: "none",
								}}
							>
								<option value="createdAt">Sort by Date</option>
								<option value="name">Sort by Name</option>
							</Select>
							<IconButton
								aria-label="Sort order"
								icon={
									sortOrder === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />
								}
								onClick={() =>
									setSortOrder(sortOrder === "asc" ? "desc" : "asc")
								}
								bg="blue.600"
								color="white"
								_hover={{
									bg: "blue.700",
									transform: "translateY(-2px)",
									boxShadow: "md",
								}}
								_active={{
									bg: "blue.800",
									transform: "translateY(0)",
								}}
							/>
						</Flex>

						{/* Board Display: arrange Swimlanes in one row */}
						<Flex gap={6} wrap="wrap">
							{boardStates.map((status) => {
								let filteredTickets = tickets.filter(
									(ticket) => ticket.status === status
								);

								if (searchQuery) {
									filteredTickets = filteredTickets.filter(
										(ticket) =>
											(ticket.name
												?.toLowerCase()
												.includes(searchQuery.toLowerCase()) ??
												false) ||
											(ticket.description
												?.toLowerCase()
												.includes(searchQuery.toLowerCase()) ??
												false)
									);
								}

								filteredTickets.sort((a, b) => {
									if (sortBy === "name") {
										const nameA = a.name || "";
										const nameB = b.name || "";
										return sortOrder === "asc"
											? nameA.localeCompare(nameB)
											: nameB.localeCompare(nameA);
									} else {
										const dateA = a.createdAt
											? new Date(a.createdAt).getTime()
											: 0;
										const dateB = b.createdAt
											? new Date(b.createdAt).getTime()
											: 0;
										return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
									}
								});

								return (
									<Swimlane
										key={status}
										title={status}
										tickets={filteredTickets}
										deleteTicket={deleteIndvTicket}
										onDrop={handleDrop}
									/>
								);
							})}
						</Flex>
					</VStack>
				</Box>
			)}
		</Container>
	);
};

export default Board;
