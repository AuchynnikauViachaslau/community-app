package com.battle.net.service;

import com.battle.net.model.Game;
import com.battle.net.model.User;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import lombok.extern.slf4j.Slf4j;

import static com.battle.net.utils.Constants.Uri.BASE_URI;
import static com.battle.net.utils.Constants.Uri.MY_GAME;
import static io.restassured.RestAssured.given;

@Slf4j
public class GameService {
    public static Response addGame(Game game) {
        log.debug("Add game with params (game:{})", game.toString());

        return given().log().all()
                .contentType(ContentType.JSON)
                .body(game)
                .when().post(BASE_URI + MY_GAME + "/add-game")
                .then().extract().response();
    }

    public static Response deleteGame(Game game) {
        log.debug("Delete game with params (game:{})", game.toString());

        return given()
                .contentType(ContentType.JSON)
                .body(game)
                .when().post(BASE_URI + MY_GAME + "/delete-game")
                .then().extract().response();
    }

    public static Response editGame(Game game) {
        log.debug("Edit game with params (game:{})", game.toString());

        return given()
                .contentType(ContentType.JSON)
                .body(game)
                .when().post(BASE_URI + MY_GAME + "/edit-game")
                .then().statusCode(200).extract().response();
    }

    public static Response getGame(User user) {
        log.debug("Get all games for user");

        return given()
                .contentType(ContentType.JSON)
                .param("userId", user.getId())
                .when().get(BASE_URI + MY_GAME + "/get-games")
                .then().statusCode(200).extract().response();
    }
}
