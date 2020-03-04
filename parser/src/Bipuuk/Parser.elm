module Bipuuk.Parser exposing (run)

import Bipuuk exposing (Tree(..))
import Parser exposing ((|.), (|=), Parser)


run : String -> Result String Tree
run =
    Result.mapError Parser.deadEndsToString
        << Parser.run textParser


textParser : Parser Tree
textParser =
    Parser.succeed identity
        |. Parser.spaces
        |= treeParser
        |. Parser.end


treeParser : Parser Tree
treeParser =
    Parser.oneOf
        [ Parser.succeed Node
            |. Parser.symbol "/"
            |. Parser.spaces
            |= Parser.lazy (\_ -> treeParser)
            |. Parser.spaces
            |. Parser.symbol "\\"
            |. Parser.spaces
            |= Parser.lazy (\_ -> treeParser)
        , Parser.succeed Null
        ]
