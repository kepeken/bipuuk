module Bipuuk exposing (Dictionary, Tree(..), emptyDictionary, height, inspect, loadDictionary, parse, toDyckWord)

import Dict exposing (Dict)
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


normalize : Tree -> String
normalize tree =
    case tree of
        Null ->
            ""

        Node bii puu ->
            if height tree <= 4 then
                getTable (toNumber bii) ++ getTable (toNumber puu)

            else
                "/" ++ normalize bii ++ "\\" ++ normalize puu


inspect : Dictionary -> Tree -> String
inspect dictionary =
    let
        inspect_ tree =
            case tree of
                Null ->
                    [ "" ]

                Node bii puu ->
                    if height tree <= 4 then
                        let
                            key =
                                getTable (toNumber bii) ++ getTable (toNumber puu)
                        in
                        [ " " ++ key ++ (Maybe.withDefault "" <| Maybe.map (\word -> " " ++ word.translation) <| Dict.get key dictionary) ]

                    else
                        case ( inspect_ bii, inspect_ puu ) of
                            ( b :: ii, p :: uu ) ->
                                ("┬─" ++ b)
                                    :: List.map (\i -> "│ " ++ i) ii
                                    ++ ("└─" ++ p)
                                    :: List.map (\u -> "  " ++ u) uu

                            _ ->
                                []
    in
    String.join "\n" << inspect_


type alias Dictionary =
    Dict String { translation : String }


emptyDictionary : Dictionary
emptyDictionary =
    Dict.empty


loadDictionary : String -> Dictionary
loadDictionary tsv =
    Dict.fromList <|
        List.drop 1 <|
            List.filterMap
                (\line ->
                    case String.split "\t" line of
                        c0 :: c1 :: c2 :: c3 :: c4 :: c5 :: c6 :: c7 :: [] ->
                            Just ( c2, { translation = c3 } )

                        _ ->
                            Nothing
                )
            <|
                String.lines tsv
