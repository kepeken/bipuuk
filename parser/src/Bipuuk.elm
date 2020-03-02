module Bipuuk exposing (Tree(..), height, inspect, parse, toDyckWord)

import Parser exposing ((|.), (|=), Parser)


type Tree
    = Null
    | Node Tree Tree


height : Tree -> Int
height tree =
    case tree of
        Null ->
            0

        Node bii puu ->
            max (height bii) (height puu) + 1


toDyckWord : Tree -> String
toDyckWord tree =
    case tree of
        Null ->
            ""

        Node bii puu ->
            "/" ++ toDyckWord bii ++ "\\" ++ toDyckWord puu


parse : String -> Result String Tree
parse =
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


toNumber : Tree -> Int
toNumber tree =
    case tree of
        Null ->
            0

        Node bii puu ->
            let
                x =
                    toNumber bii

                y =
                    toNumber puu

                m =
                    max x y
            in
            m * m + m + y - x + 1


table : String
table =
    "aeioubcdfghjklmnpqrstvwxyz"


getTable : Int -> String
getTable i =
    String.slice i (i + 1) table


inspect : Tree -> String
inspect tree =
    case tree of
        Null ->
            ""

        Node bii puu ->
            if height tree <= 4 then
                getTable (toNumber bii) ++ getTable (toNumber puu)

            else
                "/" ++ inspect bii ++ "\\" ++ inspect puu
