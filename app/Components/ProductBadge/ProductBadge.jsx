import { Tooltip, Badge } from "@mui/material"

export default function ProductBadge({ children, ...props }) {

    return(
        <Tooltip
        {...props}>
            <Badge
            variant="standard"
            color='info'
            max={99}
            badgeContent={props.productQuantity}
            sx={{
                '& .MuiBadge-badge': {
                    fontSize: '1.4em',
                    paddingTop: '.6em',
                    paddingBottom: '.6em',
                } 
            }}
            {...props}>
                {children}
            </Badge>
        </Tooltip>
    )
}