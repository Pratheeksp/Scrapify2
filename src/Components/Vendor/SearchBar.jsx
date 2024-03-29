import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setSearchQuery }) => {
  return (
    <form>
      <Box sx={{ display: { xs: "flex" }, width: { xs: "50vw" } }}>
        <TextField
          id="search-bar"
          className="text"
          //value entered by the user is sent to Main.jsx through PickupReq.jsx
          onInput={(e) => {
            setSearchQuery(e.target.value);
          }}
          label="Enter a Pickup ID"
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
      </Box>
    </form>
  );
};
export default SearchBar;
